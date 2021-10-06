import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import v4 from "uuid"
import { translate } from "sparqlalgebrajs";
const packageJSON = require("../package.json");
const initialQuery = `
PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
SELECT ?element 
WHERE {
  ?element a beo:Door .
}
`;

const newEngine = require("@comunica/actor-init-sparql").newEngine;

const Plugin = ({ sharedProps, inactive }) => {
  const { session, activeResources, setSelectedElements, selectedElements, project, setSelectionId, store } = sharedProps;
  const [query, setQuery] = useState(initialQuery);
  const [includeMeta, setIncludeMeta] = useState(false);
  const [includeMain, setIncludeMain] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [variables, setVariables] = useState([]);
  const [propagate, setPropagate] = useState(false);
  const [propagateImmediate, setPropagateImmediate] = useState(false);
  const [error, setError] = useState(null)

  function handleChange(e) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    try {
      const checkedVar = variables
        .filter((variable) => {
          return variable.checked;
        })
        .map((e) => e.name);
      const translation = translate(query);
      setError(null)
      setVariables(
        translation.variables.map((e) => {
          return {
            name: e.value,
            checked: true,
          };
        })
      );
    } catch (error) {
      setError(error.message)
    }
  }, [query]);

  async function doPropagateImmediate(binding, queryId) {
    try {
      const values = variables
      .filter((variable) => {
        return variable.checked;
      })
      .map((e) => binding.get(`?${e.name}`).id);
      const bindingResult = []
    for (const item of values) {
      const le_qe = newEngine()
      // find link element in props.ttl of

      const linkElementQuery = `
        PREFIX lbd: <https://lbdserver.org/vocabulary#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        SELECT DISTINCT ?art ?alias WHERE {
          ?art lbd:hasLinkElement ?le .
          ?le lbd:hasIdentifier ?id . 
          ?id lbd:identifier <${item}> .

          OPTIONAL { ?art owl:sameAs ?alias }
        }`;

      // const sources = [...activeResources.map(a => a.artefactRegistry)]
      const le_results = await le_qe.query(linkElementQuery, {sources: [store] });
      le_qe.invalidateHttpCache()
      const bindings = await le_results.bindings()
      bindings.forEach((bind)  => {
        const art = bind.get("?art").id;
        try {
          const alias = bind.get("?alias").id
          bindingResult.push({global: [alias], selectionId: queryId})
        } catch (error) {
          
        }
        // actually you need to find the aliases (sameAs) as well
        // so it is an array
        bindingResult.push({global: [art], selectionId: queryId})
      })
      // return bindingResult
      return bindingResult
    }
    } catch (error) {
        console.log(`error in query - doPropagateImmediate`, error)
    }
  }

  // async function propagateQuery(results, queryId) {
  //   // flatten the list of results & reduce the query to only those variables that are checked
  //   const selectedArtefacts = []
  //   for (const binding of results) {
  //     const values = variables
  //     .filter((variable) => {
  //       return variable.checked;
  //     })
  //     .map((e) => binding.get(`?${e.name}`).id);
      
  //   for (const item of values) {
  //     const le_qe = newEngine()
  //     // find link element in props.ttl of
  //     const linkElementQuery = `
  //       PREFIX lbd: <https://lbdserver.org/vocabulary#>
  //       SELECT ?art WHERE {
  //         ?art lbd:hasLinkElement ?le .
  //         ?le lbd:hasIdentifier ?id . 
  //         ?id lbd:identifier <${item}> .
  //       }`;


  //     const le_results = await le_qe.query(linkElementQuery, {sources: [store]});
  //     console.log(`le_results`, le_results)
  //     le_results.bindingsStream.on("data", async (bind) => {
  //         const art = bind.get("?art").id;
  //         selectedArtefacts.push({global: art, selectionId: queryId})
  //     });

  //     // le_results.bindingsStream.on('end', () => {
  //     //   setSelectedElements(selectedArtefacts)
  //     // })
  //   }
  //   }
  // }


  async function queryProject(e) {
    try {
      setSelectedElements([])
      setQueryResults([]);
      const queryId = v4()
      setSelectionId(queryId)
      const queryEngine = newEngine();
  
      // query only active resouces that are RDF (Future: better mime type extractor than relying on extension)
      const RDFsources = activeResources.filter((e) => {
        return e.main.endsWith(".ttl");
      });
  


      // query the RDF sources that are selected, use the selected query
      const results = await queryEngine.query(query, {
        sources: RDFsources.map((el) => el.main),
      });
  
      queryEngine.invalidateHttpCache()
  
      let res = await results.bindings()
      setQueryResults(res)
      const promisified = res.map((binding) => doPropagateImmediate(binding, queryId)) 
      const finalSelectionArray = await Promise.all(promisified)
      const finalSelection = finalSelectionArray.flat()
      setSelectedElements(finalSelection)
    } catch (error) {
      console.log(`error in query - queryProject`, error)
    }
  }

  if (inactive) return <></>;

  return (
    <div style={{ margin: 20 }}>
      <h3>Project Query</h3>
      <div>
        <TextField
          id="standard-multiline-flexible"
          label="Query"
          fullWidth
          multiline
          onChange={handleChange}
          value={query}
          helperText={error}
          error={error}
        />
        <h3>Variables to visualize</h3>
        <FormGroup>
          {variables.map((v) => {
            return (
              <FormControlLabel
                key={v.name}
                control={
                  <Checkbox
                    checked={v.checked}
                    onChange={(e) => {
                      const filtered = variables.filter((item) => {
                        return item.name !== v.name;
                      });
                      setVariables([
                        ...filtered,
                        { name: v.name, checked: !v.checked },
                      ]);
                    }}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={v.name}
              />
            );
          })}
        </FormGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={() => queryProject()}
        >
          Query
        </Button>
        <ul style={{overflowY: "scroll", maxHeight: 500, fontSize: 12}}>
          {queryResults.map((item, index) => {
            return <li key={index}>{JSON.stringify(item)}</li>
          })}
        </ul>
      </div>
    </div>
  );
};

export default Plugin;
