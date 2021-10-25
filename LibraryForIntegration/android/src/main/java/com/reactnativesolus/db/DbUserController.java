package com.reactnativesolus.db;

import com.activeandroid.query.Delete;
import com.activeandroid.query.Select;



public class DbUserController {

  public static boolean isUserExist(String name) {
    return new Select()
      .from(User.class)
      .where(User.COLUMN_USERNAME.concat(" = ?"), name)
      .exists();
  }

  public static void deleteUser(String name) {
    try {
      new Delete()
        .from(User.class)
        .where(User.COLUMN_USERNAME.concat(" = ?"), name)
        .execute();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static void saveUser(String username) {
    boolean isUserExists = new Select()
      .from(User.class)
      .where(User.COLUMN_USERNAME.concat(" = ?"), username)
      .exists();

    if (!isUserExists) {
      User user = new User(username);
      user.save();
    }
  }

}
