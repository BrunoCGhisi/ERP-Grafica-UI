import { useState } from 'react';
import { Switch } from "@mui/material";
const BasicSwitch = () => {  

const [checked, setChecked] = useState(false);

const handleChange = () => {    setChecked(!checked);  };

return (    
	<div> <p>Switch State: {checked ? 'On' : 'Off'}</p> <Switch checked={checked} onChange={handleChange} />    
	</div>  );
	}; 

export default BasicSwitch;