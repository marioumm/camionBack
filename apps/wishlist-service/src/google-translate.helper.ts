import axios from 'axios';

export class GoogleTranslateHelper {
  private static API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
  private static API_URL = 'https://translation.googleapis.com/language/translate/v2';
  private static cache = new Map<string, { text: string; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; 

  static async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang: string = 'en'
  ): Promise<string[]> {
    if (targetLang === 'en' || !texts.length) {
      return texts;
    }

    const cachedResults: string[] = [];
    const textsToTranslate: string[] = [];
    const cacheIndices: number[] = [];

    texts.forEach((text, index) => {
      const cacheKey = `${text}_${targetLang}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        cachedResults[index] = cached.text;
      } else {
        textsToTranslate.push(text);
        cacheIndices.push(index);
      }
    });

    if (!textsToTranslate.length) {
      return cachedResults;
    }

    try {
      const response = await axios.post(
        this.API_URL,
        {
          q: textsToTranslate,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        },
        {
          params: {
            key: this.API_KEY,
          },
          timeout: 5000,
        }
      );

      const translations = response.data.data.translations.map((t: any) => t.translatedText);

      translations.forEach((translation: string, i: number) => {
        const originalText = textsToTranslate[i];
        const cacheKey = `${originalText}_${targetLang}`;
        this.cache.set(cacheKey, { text: translation, timestamp: Date.now() });
        
        cachedResults[cacheIndices[i]] = translation;
      });

      return cachedResults;
    } catch (error: any) {
      console.error('Google Translate Batch Error:', error.message);
      return texts; 
    }
  }

  static cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
}

setInterval(() => GoogleTranslateHelper.cleanCache(), 10 * 60 * 1000);
