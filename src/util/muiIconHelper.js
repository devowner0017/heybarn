import React from 'react';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import BeachAccessOutlinedIcon from '@mui/icons-material/BeachAccessOutlined';

import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import PowerIcon from '@mui/icons-material/Power';
import PowerOutlinedIcon from '@mui/icons-material/PowerOutlined';

import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined';

import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifiStatusbarNullOutlinedIcon from '@mui/icons-material/SignalWifiStatusbarNullOutlined';

import LocalParkingIcon from '@mui/icons-material/LocalParking';

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import WcIcon from '@mui/icons-material/Wc';

export const getIcon = (iconName, iconProps) => {
  let iconComponent;
  switch (iconName) {
    case 'beachAccess':
      return <BeachAccessIcon {...iconProps} />;
    case 'beachAccessOutlined':
      return <BeachAccessOutlinedIcon {...iconProps} />;

    case 'lock':
      return <LockIcon {...iconProps} />;
    case 'lockOutlined':
      return <LockOutlinedIcon {...iconProps} />;

    case 'power':
      return <PowerIcon {...iconProps} />;
    case 'powerOutlined':
      return <PowerOutlinedIcon {...iconProps} />;

    case 'water':
      return <WaterDamageIcon {...iconProps} />;
    case 'waterOutlined':
      return <WaterDamageOutlinedIcon {...iconProps} />;

    case 'internet':
      return <WifiIcon {...iconProps} />;
    case 'internetOutlined':
      return <SignalWifiStatusbarNullOutlinedIcon {...iconProps} />;

    case 'internet':
      return <WifiIcon {...iconProps} />;
    case 'internetOutlined':
      return <SignalWifiStatusbarNullOutlinedIcon {...iconProps} />;

    case 'wc':
      return <WcIcon {...iconProps} />;
    case 'wcOutlined':
      return <WcIcon {...iconProps} />;

    case 'parking':
      return <LocalParkingIcon {...iconProps} />;
    case 'parkingOutlined':
      return <LocalParkingIcon {...iconProps} />;

    default:
      break;
  }
};
