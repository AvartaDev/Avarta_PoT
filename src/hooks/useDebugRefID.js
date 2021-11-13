import React, {useEffect, useState} from 'react';
import {getLatestExternalDatabaseRefID} from '@libs/localPersistenceUtils';
import SmallText from '@components/text/SmallText';

const useDebugRefID = () => {
  const [refID, setRefID] = useState('');
  const initRefId = async () => {
    setRefID(await getLatestExternalDatabaseRefID());
    console.log(refID);
  };

  useEffect(() => {
    initRefId();
  }, []);

  return {
    refID,
  };
};

export default useDebugRefID;
