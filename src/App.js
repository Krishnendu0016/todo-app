import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Code,
	Badge,
	Footer,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash, Check } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function App() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');
	const taskDeadline = useRef('');

	function createTask() {
		setTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
				deadline: taskDeadline.current.value,
				done: false,
			},
		]);

		saveTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
				deadline: taskDeadline.current.value,
				done: false,
			},
		]);
	}

	function deleteTask(index) {
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);

		saveTasks([...clonedTasks]);
	}

	function markTaskAsDone(index) {
		const updatedTasks = [...tasks];
		updatedTasks[index].done = !updatedTasks[index].done;

		setTasks(updatedTasks);
		saveTasks(updatedTasks);
	}

	function loadTasks() {
		let loadedTasks = localStorage.getItem('tasks');

		let tasks = JSON.parse(loadedTasks);

		if (tasks) {
			setTasks(tasks);
		}
	}

	function saveTasks(tasks) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Task'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={taskTitle}
							placeholder={'Task Title'}
							required
							label={'Title'}
						/>
						<TextInput
							ref={taskSummary}
							mt={'md'}
							placeholder={'Task Summary'}
							label={'Summary'}
						/>
						<TextInput
							ref={taskDeadline}
							mt={'md'}
							placeholder={'Task Deadline'}
							label={'Deadline'}
							type={'date'}
							min={new Date().toISOString().split('T')[0]}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									createTask();
									setOpened(false);
								}}>
								Create Task
							</Button>
						</Group>
					</Modal>
					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Tasks
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.title) {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												<div>
													<Text
														weight={'bold'}
														style={{
															textDecoration: task.done
																? 'line-through'
																: 'none',
														}}>
														{task.title}
													</Text>
													<Badge
														color={task.done ? 'teal' : 'gray'}
														variant={task.done ? 'filled' : 'outline'}>
														{task.done ? 'Done' : 'Pending'}
													</Badge>
												</div>
												<Group>
													<ActionIcon
														onClick={() => markTaskAsDone(index)}>
														<Check
															size={16}
															color={task.done ? 'teal' : 'gray'}
														/>
													</ActionIcon>
													<ActionIcon
														onClick={() => {
															deleteTask(index);
														}}
														color={'red'}
														variant={'transparent'}>
														<Trash />
													</ActionIcon>
												</Group>
											</Group>
											<Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this task'}
											</Text>
											<Text size={'sm'} mt={'sm'}>
												{task.deadline
													? `Deadline: ${task.deadline}`
													: 'No deadline set'}
											</Text>
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no tasks
							</Text>
						)}
						<Button
							onClick={() => {
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							New Task
						</Button>
					</Container>
					<Footer height={60} p="md" sx={{
						backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : '#f8f9fa', position: 'fixed',
						bottom: 0,
						left: 0,
						right: 0,
					}}>
						<Container size={550}>
							<Group position="apart">
								<Text size="sm" color={colorScheme === 'dark' ? 'gray.4' : 'gray.6'}>
									<span>&copy; 2023 Todo app by Krishnendu</span>
									<span>. All rights reserved.</span>
								</Text>
							</Group>
						</Container>
					</Footer>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}