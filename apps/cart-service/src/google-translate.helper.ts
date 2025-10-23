// apps/cart-service/src/utils/google-translate.helper.ts
import axios from 'axios';

export class GoogleTranslateHelper {
  private static API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
  private static API_URL = 'https://translation.googleapis.com/language/translate/v2';
  private static cache = new Map<string, { text: string; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000;

  static async translate(
    text: string,
    targetLang: string,
    sourceLang: string = 'en'
  ): Promise<string> {
    if (targetLang === 'en' || !text) {
      return text;
    }

    const cacheKey = `${text}_${targetLang}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.text;
    }

    try {
      const response = await axios.post(
        this.API_URL,
        {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        },
        {
          params: {
            key: this.API_KEY,
          },
          timeout: 3000,
        }
      );

      const translatedText = response.data.data.translations[0].translatedText;
      
      this.cache.set(cacheKey, { text: translatedText, timestamp: Date.now() });

      return translatedText;
    } catch (error) {
      console.error('Google Translate Error:', error.message);
      return text;
    }
  }

  static async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang: string = 'en'
  ): Promise<string[]> {
    if (targetLang === 'en' || !texts.length) {
      return texts;
    }

    try {
      const response = await axios.post(
        this.API_URL,
        {
          q: texts,
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

      return response.data.data.translations.map((t: any) => t.translatedText);
    } catch (error) {
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
