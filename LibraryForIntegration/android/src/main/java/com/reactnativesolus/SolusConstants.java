package com.reactnativesolus;

import android.util.Log;

public class SolusConstants {
  public static String PUBLIC_KEY = SolusModule.FACESCANENCRYPTIONKEY;
//    "-----BEGIN PUBLIC KEY-----\n" +
//      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n" +
//      "M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n" +
//      "DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n" +
//      "mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n" +
//      "GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n" +
//      "ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n" +
//      "8QIDAQAB\n" +
//      "-----END PUBLIC KEY-----";
  public static final String ZOOM_DEV_KEY = SolusModule.DEVICEKEYIDENTIFIER;
  //new int[]{100, 79, 48, 70, 83, 102, 80, 77, 87, 55, 101, 65, 104, 89, 113, 76, 99, 70, 87, 98, 85, 50, 52, 108, 104, 112, 108, 49, 102, 87, 48, 82};
  //        public static final String SERVER_BASE_URL = "https://connect.solusps.com/";
//  public static final String SERVER_BASE_URL = "https://platform.solusconnect.com/";

  //        public static final int[] ORGANISATION_KEY = new int[]{65, 53, 48, 49, 52, 68, 55, 48, 45, 55, 57, 53, 54, 45, 52, 55, 56, 69, 45, 57, 54, 56, 48, 45, 67, 57, 66, 54, 67, 69, 65, 54, 55, 54, 56, 57};
//  public static final int[] ORGANISATION_KEY = new int[]{65, 53, 48, 49, 52, 68, 55, 48, 45, 55, 57, 53, 54, 45, 52, 55, 56, 69, 45, 57, 54, 56, 48, 45, 67, 57, 66, 54, 67, 69, 65, 54, 55, 54, 56, 57};


  public static final String ACTION_SEND_INAUTH_LOGS = "ACTION_SEND_INAUTH_LOGS";
  public static final String INAUTH_SERVER_REGISTER_URL = "api/v1/inauth/register";
  public static final String INAUTH_SERVER_SEND_LOGS_URL = "api/v1/inauth/log";
  public static final String SOLUS_INAUTH_LOGS_URL = "api/v1/inauthmanager/loginauthresults";

  public static final String SOLUS_INAUTH_REGISTRATION_URL = "api/v1/inauthmanager/registerinauthdevicetouser";
  public static final int[] INAUTH_GUID = new int[]{99, 54, 53, 54, 98, 55, 49, 53, 45, 52, 98, 102, 51, 45, 52, 53, 53, 52, 45, 57, 57, 97, 51, 45, 100, 54, 48, 101, 57, 102, 56, 57, 50, 49, 99, 52};
  public static final String INAUTH_SERVER_KEYS_MESSAGE_FILE_NAME = "server_keys_message_hosted.json";
  public static final int[] INAUTH_APPLICATION_ID = new int[]{51, 100, 55, 49, 97, 99, 52, 48, 45, 56, 56, 57, 99, 45, 52, 101, 56, 53, 45, 57, 48, 98, 54, 45, 100, 99, 56, 101, 56, 57, 54, 102, 50, 51, 98, 51};


  public static String get(int[] constantArray) {
    StringBuilder sb = new StringBuilder();
    for (int anIn : constantArray) {
      sb.append((char) anIn);
    }
    return sb.toString();
  }
}

