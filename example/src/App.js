import React, { useState } from 'react';
import Map from './Map';
import UI from './UI';
import './styles.css';

export default function App() {
	const [apikey, setApikey] = useState(process.env.ARCGIS_API_KEY);
	const [keyModalOpen, setKeyModalOpen] = useState(false);

	return (
		<div className="App">
			<Map apikey={apikey} />
			<UI
				setApikey={setApikey}
				keyModalOpen={keyModalOpen}
				setKeyModalOpen={setKeyModalOpen}
			/>
		</div>
	);
}
