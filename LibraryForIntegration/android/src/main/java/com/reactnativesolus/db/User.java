package com.reactnativesolus.db;

import com.activeandroid.Model;
import com.activeandroid.annotation.Column;
import com.activeandroid.annotation.Table;

@Table(name = "user")
public class User extends Model {

  public static final String COLUMN_USERNAME = "username";

  @Column(name = COLUMN_USERNAME)
  private String mUsername;

  public User() {
    super();
  }

  public User(String username) {
    this();
    mUsername = username;
  }

  public String getUsername() {
    return mUsername;
  }
}
