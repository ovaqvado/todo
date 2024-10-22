import { Button, Checkbox } from 'antd'
import { useState } from 'react'
import './Todo.css'
import arrow from './arrow.svg'

export interface TodoItem {
	id: string
	text: string
	completed: boolean
}

export const Todo = () => {
	const [todos, setTodos] = useState<TodoItem[]>([])
	const [newTodo, setNewTodo] = useState('')
	const [count, setCount] = useState(0)
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [isListVisible, setIsListVisible] = useState(true)

	const addNewTodo = () => {
		const trimmedTodo = newTodo.trim()
		if (!trimmedTodo) {
			return alert('Поле не должно быть пустым')
		}

		const isDuplicate = todos.some(
			todo => todo.text.toLowerCase() === trimmedTodo.toLowerCase()
		)
		if (isDuplicate) {
			return alert('Такой пункт уже есть')
		}

		const newId = crypto.randomUUID()
		const newTodoItem: TodoItem = {
			id: newId,
			text: trimmedTodo,
			completed: false,
		}
		setTodos([...todos, newTodoItem])
		setNewTodo('')
		setCount(count + 1)
	}

	const clearCompleted = () => {
		const completedTodos = todos.filter(todo => todo.completed)
		if (completedTodos.length > 0) {
			const updatedTodos = todos.filter(todo => !todo.completed)
			setTodos(updatedTodos)
			setCount(count - completedTodos.length)
			setTimeout(() => {
				alert('Список очищен')
			}, 500)
		}
	}

	const toggleComplete = (id: string) => {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				return { ...todo, completed: !todo.completed }
			}
			return todo
		})
		setTodos(updatedTodos)
	}

	const getFilteredTodos = () => {
		switch (filter) {
			case 'active':
				return todos.filter(todo => !todo.completed)
			case 'completed':
				return todos.filter(todo => todo.completed)
			case 'all':
			default:
				return todos
		}
	}

	return (
		<div className='todos_box'>
			<div className='input_box'>
				<input
					className='input_search'
					placeholder='What needs to be done?'
					type='text'
					value={newTodo}
					onChange={e => setNewTodo(e.target.value)}
				/>
				<button
					className='button_arrow'
					onClick={() => setIsListVisible(!isListVisible)}
				>
					<img className='img_arrow' src={arrow} alt='Toggle list visibility' />
				</button>
			</div>
			<button className='add_btn' onClick={addNewTodo}>
				Add Todo
			</button>
			{isListVisible && (
				<div className='box_list'>
					<ul className='box_ul'>
						{getFilteredTodos().map(todo => (
							<Checkbox
								className='custom-checkbox'
								checked={todo.completed}
								onChange={() => toggleComplete(todo.id)}
								key={todo.id}
							>
								<span
									className={`${'base_text'} ${
										todo.completed ? 'completed-text' : ''
									}`}
								>
									{todo.text}
								</span>
							</Checkbox>
						))}
					</ul>
				</div>
			)}
			<div className='group_btn'>
				<p className='count'>{count} items left</p>
				<div className='buttons'>
					<Button className='btn' onClick={() => setFilter('all')}>
						All
					</Button>
					<Button className='btn' onClick={() => setFilter('active')}>
						Active
					</Button>
					<Button className='btn' onClick={() => setFilter('completed')}>
						Completed
					</Button>
				</div>
				<button className='btn_clear' onClick={clearCompleted}>
					Clear completed
				</button>
			</div>
		</div>
	)
}
