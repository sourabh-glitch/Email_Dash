import './App.css';
import { useRoutes } from 'react-router-dom';
import { appRoutes } from './data/appRoutes.jsx';

const AppRoutes = () => useRoutes(appRoutes);

const App = () => <AppRoutes />;

export default App;
