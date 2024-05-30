import TaskList from './components/Tasklist';

//create your first component
const App = () => {

	return (
		<div class="w-50 flex-wrap m-auto">
        <h1 class="text-light text-center mb-2 border border-light border-top-0 pt-5 pb-3">Listando To~Dos</h1>
		<TaskList />
		</div>
	);
};

export default App
