# Firebase Setup Guide

## Overview
Firebase adalah platform pengembangan aplikan dari Google untuk membangun aplikasi web dan mobile.

## Services

### Authentication
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
await signInWithEmailAndPassword(auth, email, password);
```

### Firestore Database
```javascript
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Add document
await addDoc(collection(db, 'users'), { name: 'John' });

// Get documents
const snapshot = await getDocs(collection(db, 'users'));
```

### Cloud Storage
```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storageRef = ref(storage, 'images/photo.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

### Hosting
```bash
firebase deploy --only hosting
```

## Configuration

### firebase.json
```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Best Practices

1. **Security Rules**: Selalu gunakan security rules
2. **Indexes**: Buat index untuk query kompleks
3. **Offline support**: Firestore punya offline persistence
4. **Structure**: Hindari data terlalu nested

## References
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
