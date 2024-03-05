
// if running vire in dev mode 
// let routeshim = "http://localhost:3001"

let getRouteShim = () => {
    if (import.meta.env.DEV) {
        return "http://localhost:3001"
    } else {
        return ""
    }
}
// let routeshim = ""

export { getRouteShim }