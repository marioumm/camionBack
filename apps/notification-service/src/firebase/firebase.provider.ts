/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

export const FirebaseAdminProvider: Provider = {
  provide: FIREBASE_ADMIN,
  useFactory: () => {
    const b64 = process.env.FIREBASE_CREDENTIALS_BASE64 || '';
    const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
    const credential = JSON.parse(jsonStr);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(credential),
      });
    }
    return admin;
  },
};
