import { handleError } from "../handlers/handleError"

export const getNameLastName = (name) => {
    try {

        if (!name) return null

        name = name.split(" ")

        const firstName = name[0]
        if (name.length === 1) return firstName

        const lastName = name[1].length < 5 ? name[1] + " " + name[2] : name[1]

        return firstName + " " + lastName
    } catch ({ message }) {
        handleError("getNameLastName", message)
    }
}
