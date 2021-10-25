package com.reactnativesolus;

import android.os.Parcel;
import android.os.Parcelable;

import com.solus.integrationlibrary.data.api.response.ScoreResponse;

public class UserData implements Parcelable {

  private String mUsername;
  private String mPassword;
  private ScoreResponse mScoreResponse;

  public UserData() {
    super();
  }

  public void setUsername(String username) {
    mUsername = username;
  }

  public void setPassword(String password) {
    mPassword = password;
  }

  public String getUsername() {
    return mUsername;
  }

  public String getPassword() {
    return mPassword;
  }

  @Override
  public int describeContents() {
    return 0;
  }

  @Override
  public void writeToParcel(Parcel dest, int flags) {
    dest.writeString(this.mUsername);
    dest.writeString(this.mPassword);
    dest.writeParcelable(this.mScoreResponse, flags);
  }

  protected UserData(Parcel in) {
    this.mUsername = in.readString();
    this.mPassword = in.readString();
    this.mScoreResponse = in.readParcelable(ScoreResponse.class.getClassLoader());
  }

  public static final Creator<UserData> CREATOR = new Creator<UserData>() {
    @Override
    public UserData createFromParcel(Parcel source) {
      return new UserData(source);
    }

    @Override
    public UserData[] newArray(int size) {
      return new UserData[size];
    }
  };
}
