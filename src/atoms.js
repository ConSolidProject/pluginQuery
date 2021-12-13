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

const datasets = atom({
    key: "datasets",
    default: [{main: "https://pod.lbdserver.org/jeroen/lbd/f65db6eb-fc13-4ee7-955a-cf93fdf29d5b/architectural_duplex.ttl", metadata: "https://pod.lbdserver.org/jeroen/lbd/f65db6eb-fc13-4ee7-955a-cf93fdf29d5b/architectural_duplex.ttl.props.ttl"}]
})

const selectedElements = atom({
    key: "selectedElements",
    default: [{"_id":"61af9a6d4c65ec4c9e96d6fe","project":"http://localhost:5000/arch/lbd/testproject","url":"http://localhost:5001/reference/thing_798b91c9-4bba-49a8-b9a6-e98cecde673b","alias":[],"references":[{"_id":"61af9a6d4c65ec4c9e96d700","project":"http://localhost:5000/arch/lbd/testproject","dataset":"http://localhost:5000/arch/lbd/testproject/local/datasets/b8MbRixj5xu3H2HPX7rRe8/","distribution":"http://localhost:5000/arch/lbd/testproject/local/datasets/b8MbRixj5xu3H2HPX7rRe8/7v3TaEP9Fuq6swVkqSksue","id":"1CZILmCaHETO8tf3SgGEXu","alias":[],"thing":"61af9a6d4c65ec4c9e96d6fe","__v":0},{"_id":"61af9a6d4c65ec4c9e96d705","project":"http://localhost:5000/arch/lbd/testproject","dataset":"http://localhost:5000/arch/lbd/testproject/local/datasets/g5MboPMAhymJ48efrsVew3/","distribution":"http://localhost:5000/arch/lbd/testproject/local/datasets/g5MboPMAhymJ48efrsVew3/4qeHxS4DXM5hRLEX7pLCrW","id":"https://lbdserver.org/projects/642f0417-ce23-4d9d-8806-c078aed93ae1/slab_4c8d2570-3244-4e75-8237-a4372a40e878","alias":[],"thing":"61af9a6d4c65ec4c9e96d6fe","__v":0}],"__v":1}]
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

export {session, projects, datasets, selectedElements, selectionId, trigger, store}