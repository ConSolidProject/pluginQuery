import {atom, atomFamily, selectorFamily} from 'recoil'
import {Session} from "@inrupt/solid-client-authn-browser"
const N3 = require("n3");

const session = atom({
    key: "session",
    default: new Session()
})

const projects = atom({
    key: "projects",
    default: ["http://localhost:5000/jeroen/lbd/f65db6eb-fc13-4ee7-955a-cf93fdf29d5b/"]
})

const activeResources = atom({
    key: "activeResources",
    default: [{main: "https://pod.lbdserver.org/jeroen/lbd/f65db6eb-fc13-4ee7-955a-cf93fdf29d5b/architectural_duplex.ttl", metadata: "https://pod.lbdserver.org/jeroen/lbd/f65db6eb-fc13-4ee7-955a-cf93fdf29d5b/architectural_duplex.ttl.props.ttl"}]
})

const selectedElements = atom({
    key: "selectedElements",
    default: []
})

const selectionId = atom({
    key: "selectionId",
    default: ""
})

const trigger = atom({
    key: "trigger",
    default: '0'
})

const store = atom({
    key: "store", 
    default: new N3.Store()
})

export {session, projects, activeResources, selectedElements, selectionId, trigger, store}