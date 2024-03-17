import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:9192/api/tasks"
})

export const createTask = async(newTask) =>{
    try {
        const response = await api.post("/new", newTask)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

//TODO
export const getAllQuestions = async() =>{
    try {
        const response = await api.get("/all-questions")
        return response.data
    } catch (error) {
        console.error(error)
        return []
    }
}

export const startTask = async(id) =>{
    try {
        const response = await api.put(`/my-tasks/{id}/start`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
export const stopTask = async(id) =>{
    try {
        const response = await api.put(`/my-tasks/{id}/stop`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
export const completeTask = async(id) =>{
    try {
        const response = await api.put(`/my-tasks/{id}/complete`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const getTaskById = async(id) =>{
    try {
        const response = await api.get(`/my-tasks/{id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const deleteTask = async(id) =>{
    try {
        const response = await api.delete(`/my-tasks/{id}/delete`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}