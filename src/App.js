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
import v4 from "uuid";
import { translate } from "sparqlalgebrajs";
import { getDistributionsByMediaType, findReferenceEndpoints } from "consolid";

const initialQuery = `
PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
SELECT ?element 
WHERE {
  ?element a beo:Door .
}
`;

const newEngine = require("@comunica/actor-init-sparql").newEngine;

const Plugin = ({ sharedProps, inactive }) => {
  const {
    session,
    datasets,
    setSelectedElements,
    selectedElements,
    projects,
    setSelectionId,
    store,
  } = sharedProps;
  
  const [query, setQuery] = useState(initialQuery);
  const [includeMeta, setIncludeMeta] = useState(false);
  const [includeMain, setIncludeMain] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [variables, setVariables] = useState([]);
  const [propagate, setPropagate] = useState(false);
  const [propagateImmediate, setPropagateImmediate] = useState(false);
  const [error, setError] = useState(null);

  const project = projects[Object.keys(projects)[0]]
  //Object.keys(project).map((p) => {
  //   return project[p].ref.accessURL
  // })
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
      setError(null);
      setVariables(
        translation.variables.map((e) => {
          return {
            name: e.value,
            checked: true,
          };
        })
      );
    } catch (error) {
      setError(error.message);
    }
  }, [query]);

  function extractIdentifiers(bindings) {
    const identifiers = []
    for (const v of variables) {
      if (v.checked) {
        for (const b of bindings)
        identifiers.push(b[v.name].value)
      }

    }
    return identifiers
  }

  // async function doPropagateImmediate(binding, queryId) {
  //   try {
  //     const values = variables
  //       .filter((variable) => {
  //         return variable.checked;
  //       })
  //       .map((e) => binding[e.name].value);
  //     const bindingResult = [];
  //     for (const item of values) {
  //       const le_qe = newEngine();
  //       // find link element in props.ttl of

  //       const linkElementQuery = `
  //       PREFIX lbd: <https://lbdserver.org/vocabulary#>
  //       PREFIX owl: <http://www.w3.org/2002/07/owl#>
  //       SELECT ?art ?alias WHERE {
  //         ?art lbd:hasReference ?le .
  //         ?le lbd:hasIdentifier ?id . 
  //         ?id lbd:identifier <${item}> .

  //         OPTIONAL { ?art owl:sameAs ?alias }
  //       }`;

  //       // const sources = [...datasets.map(a => a.artefactRegistry)]
  //       for (const ref of references) {
  //         const url = encodeURI(ref + linkElementQuery).replaceAll("#", "%23")
  //         const data = await session.fetch(url)
  //         const bindings = await data.json()
  //         bindings.results.bindings.forEach(bind => {
  //           const thing = {}
  //           const art = bind["art"].value;
  //           thing.global = [art]
  //           thing.selectionId = queryId
  //           try {
  //             const alias = bind["alias"].value;
  //             thing.global.push(alias)
  //           } catch (error) {}
  //             bindingResult.push(thing)
  //         })
  //       }



  //       // const le_results = await le_qe.query(linkElementQuery, {
  //       //   sources: references, fetch: session.fetch
  //       // });
  //       // const bindings = await le_results.bindings();
  //       // bindings.forEach((bind) => {
  //       //   const thing = {}
  //       //   const art = bind.get("?art").id;
  //       //   thing.global = [art]
  //       //   thing.selectionId = queryId
  //       //   try {
  //       //     const alias = bind.get("?alias").id;
  //       //     thing.global.push(alias)
  //       //   } catch (error) {}
  //       //     bindingResult.push(thing)
  //       // });
  //       // return bindingResult
  //     }
  //     return bindingResult;
  //   } catch (error) {
  //     console.log(`error in query - doPropagateImmediate`, error);
  //   }
  // }

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
      setSelectedElements([]);
      setQueryResults([]);
      const queryId = v4();
      setSelectionId(queryId);
      const queryEngine = newEngine();

      const filtered = await getDistributionsByMediaType(datasets, "text/turtle", session)

      let result = []
      let queryResults
      if (filtered.length > 0) {
        for (const item of filtered) {
          const url = encodeURI(item.url + query).replaceAll("#", "%23")
          const r = await session.fetch(url).then(res => res.json())
          console.log(`r`, r)
          queryResults = r.results.bindings
          const identifiers = extractIdentifiers(r.results.bindings)
          result.push({dataset: item.dataset, identifiers})
        }
      }

      // // query the RDF sources that are selected, use the selected query
      // if (download.length > 0) {
      //   for (const item of download) {
      //     const r = await queryEngine.query(query, {
      //       sources: [item.downloadURL],
      //     }).then(res => res.json())
      //     const identifiers = extractIdentifiers(r.results.bindings)
      //     result.push({dataset: item.dataset, identifiers})
      //   }
      // }

      setQueryResults(queryResults);
      console.log(`JSON.stringify({selection: result})`, JSON.stringify({selection: result}))
      const finalSelection = []
      const references = await findReferenceEndpoints(project, session)

      for (const ref of references) {
        const options = {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({selection: result})
        }
        const stakeholderSelection = await session.fetch(ref, options).then(r => r.json())
        finalSelection.push(stakeholderSelection)
      }
      setSelectedElements(finalSelection.flat())

    } catch (error) {
      console.log(`error in query - queryProject`, error);
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
        <ul style={{ overflowY: "scroll", maxHeight: 500, fontSize: 12 }}>
          {queryResults.map((item, index) => {
            return <li key={index}>{JSON.stringify(item)}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Plugin;
