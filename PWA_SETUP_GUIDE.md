# Brewery Tracker - Mobile App Installation Guide

## 📱 Install on Your Phone

Your Brewery Tracker is now a **Progressive Web App (PWA)** that can be installed directly on your phone like a native app!

### **Installation Steps**

#### **For iPhone (iOS 15.1+):**

1. **Open in Safari**
   - Open Safari browser on your iPhone
   - Navigate to your app URL (you'll host this on a web server)

2. **Add to Home Screen**
   - Tap the **Share** button at the bottom
   - Scroll down and tap **"Add to Home Screen"**
   - Give it a name (default: "Brewery Tracker")
   - Tap **"Add"**

3. **Launch the App**
   - Your app now appears on your home screen
   - It launches in full-screen mode (no browser chrome)
   - Looks and feels like a native app!

**Note:** iOS doesn't show an install prompt banner like Android. You must manually add it via Share menu.

---

#### **For Android:**

1. **Open in Chrome (or any Chromium browser)**
   - Open Chrome on your Android device
   - Navigate to your app URL

2. **Install Prompt**
   - You'll see an **"Install Brewery Tracker"** banner
   - Or tap the **⋮** menu → **"Install app"**
   - Tap **"Install"**

3. **App Installed**
   - The app appears on your home screen
   - Tap to launch in full-screen mode
   - Can be accessed from App Drawer too

---

## 🚀 Hosting Your App

Since this is a PWA, you need to host it on a web server. Here are your options:

### **Option 1: Free Hosting (Recommended for Testing)**

**Vercel** (Recommended - very easy)
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Create a repository with your files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
4. Deploy from GitHub
5. Your app gets a public URL instantly
6. Updates deploy automatically

**GitHub Pages**
1. Create a GitHub repository named `brewery-tracker`
2. Upload your files
3. Go to Settings → Pages → Deploy from branch
4. Your site is live at: `username.github.io/brewery-tracker`

**Netlify** (https://netlify.com)
1. Drag and drop your folder
2. Instant public URL
3. Free SSL certificate

### **Option 2: Your Own Server**

If you have a web server:
1. Upload the three files to your server
2. Ensure **HTTPS is enabled** (required for PWA)
3. Test at your domain

---

## ✅ PWA Features Included

### **Offline Support**
- ✅ Works completely offline
- ✅ All data stored locally on your phone
- ✅ Creates batches without internet
- ✅ Auto-syncs when back online

### **Native App Experience**
- ✅ Full-screen mode (no browser UI)
- ✅ Custom app icon on home screen
- ✅ App shortcuts (quick actions)
- ✅ Status bar matches app theme
- ✅ Install banner on Android

### **Local Data Storage**
- ✅ Browser storage (no cloud login needed)
- ✅ All data stays on your phone
- ✅ Persistent between sessions
- ✅ Can export/backup as JSON

### **Background Sync** (Optional)
- ✅ Sync to Google Sheets when online
- ✅ Automatic retry on reconnection
- ✅ Push notifications support

---

## 🔧 File Structure

Your hosting folder should contain:

```
brewery-tracker/
├── index.html          (Main app)
├── manifest.json       (PWA metadata)
├── sw.js              (Service Worker - offline support)
└── README.md          (This file)
```

---

## 🌐 HTTPS Requirement

**Important:** PWAs require HTTPS (secure connection)

- ✅ Vercel: Automatic HTTPS
- ✅ Netlify: Automatic HTTPS
- ✅ GitHub Pages: Automatic HTTPS
- ❌ Local testing: Use `http://localhost`
- ⚠️ Self-hosted: You must set up SSL certificate

If you're self-hosting, use **Let's Encrypt** for free SSL:
```bash
# Using Certbot
sudo certbot certonly --webroot -w /var/www/your-site -d yourdomain.com
```

---

## 📲 Testing the Installation

### **Test on Your Phone:**

1. **Open in browser** and navigate to your app URL
2. **Install the app:**
   - **Android:** Tap install banner (or ⋮ menu)
   - **iOS:** Tap Share → Add to Home Screen
3. **Launch from home screen** - should open full-screen
4. **Test offline:**
   - Turn on airplane mode
   - App still works and stores data
   - Turn off airplane mode
   - Data syncs automatically

### **Test Offline Features:**

1. Create a batch online
2. Go offline (airplane mode)
3. Create another batch
4. Go back online
5. Both batches should be there

---

## 🔄 Google Sheets Sync (Optional)

To sync with Google Sheets:

1. Set up your Google Sheet
2. Add column headers matching batch fields
3. Use the "Connect Sheets" button in the app
4. Paste your Google Sheet URL
5. Click "Sync Now" to sync data

**Note:** Syncing requires internet connection.

---

## 📤 Backup Your Data

### **Export as JSON:**
1. Open the app
2. Click "Export" button
3. Save the `.json` file
4. Keep it safe!

### **Import Data:**
1. Open the app
2. Click "Import" button
3. Select a `.json` file you exported
4. Data gets added to your app

---

## 🆘 Troubleshooting

### **App won't install**
- ✅ Make sure you're on HTTPS (not http://)
- ✅ Check that browser is up to date
- ✅ Refresh page and try again

### **Changes don't save**
- ✅ Check browser storage isn't full
- ✅ Try clearing browser cache and reload
- ✅ Check if data is in localStorage (browser dev tools)

### **Sync not working**
- ✅ Check you're online
- ✅ Verify Google Sheet URL is correct
- ✅ Make sure sheet is shared with proper permissions

### **App is slow**
- ✅ Clear browser cache
- ✅ Close other apps/tabs
- ✅ Restart phone
- ✅ Service Worker might be updating in background

### **Lost data**
- ✅ Check if data is in browser storage
- ✅ Check your JSON backup files
- ✅ Email yourself a backup regularly

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Three files created: `index.html`, `manifest.json`, `sw.js`
- [ ] All files in same directory
- [ ] Hosting on HTTPS
- [ ] Test installation on Android phone
- [ ] Test installation on iPhone
- [ ] Create offline and verify it saves
- [ ] Test sync features
- [ ] Export/import works
- [ ] Bookmark backup location

---

## 📊 Advanced Features (Coming Soon)

- Google Sheets two-way sync
- Automatic daily backups
- TTB reporting dashboard
- Label printing
- Team collaboration
- Analytics & insights

---

## 💡 Tips & Tricks

### **Quick Tips:**
1. **Use search** to find batches quickly
2. **Filter by status** to see production timeline
3. **Expand cards** to see full details
4. **Export regularly** as backup
5. **iOS Tip:** Add a shortcut to "New Batch" on home screen for faster entry

### **Best Practices:**
- Sync to Google Sheets weekly
- Export JSON backup monthly
- Keep your phone updated
- Don't delete the app from home screen, uninstall through settings instead

---

## 📞 Support

If you run into issues:

1. Check the troubleshooting section above
2. Clear browser cache and reload
3. Try a different browser
4. Update your phone OS
5. Restart your phone

---

## 🎉 You're All Set!

Your Brewery Tracker is ready to use as a native mobile app!

**Next Steps:**
1. Deploy to hosting service (Vercel/Netlify/GitHub Pages)
2. Get the public URL
3. Open on your phone
4. Install the app
5. Start tracking batches!

Happy brewing! 🍺
