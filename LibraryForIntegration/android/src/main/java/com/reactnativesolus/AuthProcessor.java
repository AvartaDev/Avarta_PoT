package com.reactnativesolus;

import android.content.Intent;

public interface AuthProcessor {

  void doAuthOperation();

  void onActivityResult(int requestCode, int resultCode, Intent data) ;

}
