declare module 'react-native-get-sms-android' {
    interface SmsFilter {
      box?: 'inbox' | 'sent' | 'draft' | 'outbox' | 'failed' | 'queued' | '';
      minDate?: number;
      maxDate?: number;
      bodyRegex?: string;
      read?: 0 | 1;
      _id?: number;
      thread_id?: number;
      address?: string;
      body?: string;
      indexFrom?: number;
      maxCount?: number;
    }
  
    interface SmsAndroid {
      list(
        filter: string,
        fail: (error: string) => void,
        success: (count: number, smsList: string) => void
      ): void;
    }
  
    const SmsAndroid: SmsAndroid;
    export default SmsAndroid;
  }