import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const RockForm = ({ fetchRocks }) => {
    const initialRockState = {
        name: "",
        weight: 0,
        typeId: 0
    }

    const [types, changeTypes] = useState([{ id: 1, label: "Igneous" }, { id: 2, label: "Volcanic" }])
    const [rock, updateRockProps] = useState(initialRockState)
    const navigate = useNavigate()

    const fetchTypes = async () => {
        const response = await fetch("http://localhost:8000/types", {
            headers: {
                "Authorization": `Token ${JSON.parse(localStorage.getItem("rock_token")).token}`
            }
        })
        const types = await response.json()
        changeTypes(types)
    }

    useEffect(() => {
        fetchTypes()
    }, [])
    
    console.log(rock)

    const collectRock = async (evt) => {
        evt.preventDefault();
    
        try {
            const response = await fetch("http://localhost:8000/rocks", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${JSON.parse(localStorage.getItem("rock_token")).token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rock)
            });
    
            const data = await response.json();
            console.log("API Response:", data); // Log API response to check for clues
    
            if (!response.ok) {
                throw new Error(`Error: ${data.detail || response.statusText}`);
            }
    
            await fetchRocks();
    
            navigate("/allrocks");
    
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    return (
        <main className="container--login">
            <section>
                <form className="form--login" onSubmit={() => { }}>
                    <h1 className="text-3xl">Collect a Rock</h1>
                    <fieldset className="mt-4">
                        <label htmlFor="rock">Name:</label>
                        <input id="rock" type="text"
                            onChange={e => {
                                const copy = { ...rock }
                                copy.name = e.target.value
                                updateRockProps(copy)
                            }}
                            value={rock.name} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="weight">Weight in kg:</label>
                        <input id="weight" type="number"
                            onChange={e => {
                                const copy = { ...rock }
                                copy.weight = e.target.value
                                updateRockProps(copy)
                            }}
                            value={rock.weight} className="form-control" />
                    </fieldset>
                    <fieldset className="mt-4">
                        <label htmlFor="type"> Type </label>
                        <br />
                        <select id="type" className="form-control"
                            onChange={e => {
                                const copy = { ...rock }
                                copy.typeId = parseInt(e.target.value)
                                updateRockProps(copy)
                            }}>
                            <option value={0}>- Select a type -</option>
                            {
                                types.map(t => <option
                                    key={`type-${t.id}`}
                                    value={t.id}>{t.label}</option> )
                            }
                        </select>
                    </fieldset>

                    <fieldset>
                        <button type="submit"
                            onClick={collectRock}
                            className="button rounded-md bg-blue-700 text-blue-100 p-3 mt-4">
                            Collect Rock
                        </button>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}