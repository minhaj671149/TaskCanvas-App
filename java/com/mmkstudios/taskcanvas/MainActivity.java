package com.mmkstudios.taskcanvas;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.SharedPreferences;

public class MainActivity extends AppCompatActivity {

    private static final String CHANNEL_ID = "pomodoro_timer_channel";
    private static final int NOTIFICATION_PERMISSION_REQUEST_CODE = 1;
    private static final String PREFS_NAME = "TaskCanvasPrefs";
    private static final String PREF_NOTIFICATION_REQUESTED = "notificationRequested";

    private WebView mywebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up the WebView
        mywebView = findViewById(R.id.webview);
        mywebView.setWebViewClient(new mywebClient());
        mywebView.loadUrl("file:///android_asset/index.html");

        WebSettings webSettings = mywebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        mywebView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(mywebView, true);

        // Add the JavaScript interface for notification handling
        mywebView.addJavascriptInterface(new WebAppInterface(this), "AndroidNotification");

        // Create notification channel for Android 8 and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Pomodoro Timer Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public class WebAppInterface {
        Context context;

        WebAppInterface(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void sendNotification(String message) {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.mipmap.ic_notification)
                    .setContentTitle("Pomodoro Timer")
                    .setContentText(message)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);

            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(1, builder.build());
        }

        @JavascriptInterface
        public void requestNotificationPermissionIfNeeded() {
            SharedPreferences preferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
            boolean notificationRequested = preferences.getBoolean(PREF_NOTIFICATION_REQUESTED, false);

            // Request notification permission only if it hasn't been requested before
            if (!notificationRequested && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                ActivityCompat.requestPermissions(MainActivity.this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        NOTIFICATION_PERMISSION_REQUEST_CODE);

                // Update the preference to indicate that permission has been requested
                SharedPreferences.Editor editor = preferences.edit();
                editor.putBoolean(PREF_NOTIFICATION_REQUESTED, true);
                editor.apply();
            }
        }
    }

    public class mywebClient extends WebViewClient {
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);

            // Check if the user has navigated to pomodoro.html and request notification permission if needed
            if (url.contains("pomodoro.html") && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                mywebView.post(() -> {
                    if (mywebView.getSettings().getJavaScriptEnabled()) {
                        mywebView.evaluateJavascript("AndroidNotification.requestNotificationPermissionIfNeeded()", null);
                    }
                });
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
    }

    // Handle the result of the notification permission request
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST_CODE) {
            // No additional action required, notification prompt will simply close based on user's response
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onBackPressed() {
        if (mywebView.canGoBack()) {
            mywebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}