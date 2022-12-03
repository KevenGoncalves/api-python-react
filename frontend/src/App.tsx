import { SyntheticEvent, useEffect, useState } from "react";
import "./styles/App.css";

const backendUrl = "http://127.0.0.1:8000/users";

type ItemType = { id?: string; name?: string; handleDeleteUser?: any; handleUpdateUser?: any };

function Item({ id, name, handleDeleteUser, handleUpdateUser }: ItemType) {
	const [edit, setEdit] = useState<ItemType>();

	return (
		<div className="item">
			<span>{id}</span>
			<span>{name}</span>
			<div className="buttons">
				<button onClick={() => handleDeleteUser(id)}>❌</button>
				<div className="edit">
					✏️
					<div className="modal">
						<input
							onChange={(event) => setEdit({ name: event.target.value })}
							type="text"
							placeholder="Novo nome"
							value={edit?.name}
						/>
						<button
							className="edit-button"
							onClick={() => {
								setEdit({ name: "" });
								handleUpdateUser(id, edit);
							}}
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function App() {
	const [users, setUsers] = useState<ItemType[] | []>([]);
	const [current, setCurrent] = useState<ItemType>();

	useEffect(() => {
		fetch(backendUrl, {
			method: "GET",
		})
			.then((resp) => resp.json())
			.then((users) => setUsers(users))
			.catch((error) => console.log(error));

		return () => setUsers([]);
	}, []);

	const handleCreateUser = (event: SyntheticEvent) => {
		event.preventDefault();
		fetch(backendUrl, {
			method: "POST",
			body: JSON.stringify(current),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((resp) => resp.json())
			.then((users) => setUsers(users))
			.catch((error) => console.log(error));
		setCurrent({ name: "" });
	};

	const handleDeleteUser = (id: string) => {
		fetch(`${backendUrl}/${id}`, { method: "DELETE" })
			.then((resp) => resp.json())
			.then((users) => setUsers(users))
			.catch((error) => console.log(error));
	};

	const handleUpdateUser = (id: string, current: { name: string }) => {
		fetch(`${backendUrl}/${id}`, {
			method: "PUT",
			body: JSON.stringify(current),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((resp) => resp.json())
			.then((users) => setUsers(users))
			.catch((error) => console.log(error));
	};

	return (
		<div className="container">
			<div className="container-menu">
				<form>
					<input
						value={current?.name}
						onChange={(value) => setCurrent({ name: value.target.value })}
						type="text"
						placeholder="Digite o nome"
					/>
					<button onClick={handleCreateUser}>Enviar</button>
				</form>
				<div className="items">
					<div className="item">
						<span>ID</span>
						<span>Nome</span>
						<div>Ações</div>
					</div>
					{users.map((user) => (
						<Item
							key={user.id}
							id={user.id}
							name={user.name}
							handleDeleteUser={handleDeleteUser}
							handleUpdateUser={handleUpdateUser}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
