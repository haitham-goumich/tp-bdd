
export interface FirebaseImage {
  id: string;
  url: string;
  name: string;
  createdAt: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export type AppMode = 'RESEARCH' | 'GALLERY';
