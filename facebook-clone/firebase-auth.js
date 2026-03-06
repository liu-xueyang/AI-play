/**
 * Firebase 初始化与认证模块 (CDN 版)
 * 在 index.html 中通过 <script type="module" src="firebase-auth.js"></script> 引入
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvQxOi44dOjqaGsL4UKtSEZdNUuYQSb44",
  authDomain: "ai-play-8c181.firebaseapp.com",
  projectId: "ai-play-8c181",
  storageBucket: "ai-play-8c181.firebasestorage.app",
  messagingSenderId: "85532805559",
  appId: "1:85532805559:web:be19b0f39cef7cb0dbc032",
  measurementId: "G-3JKLS9RMBJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

/**
 * 暴露给全局，供 app.js 等非模块脚本使用
 */
window.FirebaseAuth = {
  app,
  auth,
  analytics,
  async signUp(email, password) {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return userCred.user;
  },
  async signIn(email, password) {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  },
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCred = await signInWithPopup(auth, provider);
    return userCred.user;
  },
  async signOutUser() {
    await signOut(auth);
  },
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};

// 通知 app.js 可以开始使用
window.dispatchEvent(new CustomEvent("firebase-auth-ready"));
