(self.webpackChunkprojectquery=self.webpackChunkprojectquery||[]).push([[1640],{41640:function(e,t,a){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,a,r){void 0===r&&(r=a),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[a]}})}:function(e,t,a,r){void 0===r&&(r=a),e[r]=t[a]}),s=this&&this.__exportStar||function(e,t){for(var a in e)"default"===a||Object.prototype.hasOwnProperty.call(t,a)||r(t,e,a)};Object.defineProperty(t,"__esModule",{value:!0}),s(a(7970),t),s(a(37498),t),s(a(16381),t),s(a(72808),t),s(a(92016),t),s(a(63387),t),s(a(71573),t)},7970:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.BlankNode=void 0,t.BlankNode=class{constructor(e){this.termType="BlankNode",this.value=e}equals(e){return!!e&&"BlankNode"===e.termType&&e.value===this.value}}},37498:(e,t,a)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DataFactory=void 0;const r=a(7970),s=a(16381),u=a(72808),i=a(92016),l=a(63387),o=a(71573);let n=0;t.DataFactory=class{constructor(e){this.blankNodeCounter=0,e=e||{},this.blankNodePrefix=e.blankNodePrefix||`df_${n++}_`}namedNode(e){return new i.NamedNode(e)}blankNode(e){return new r.BlankNode(e||`${this.blankNodePrefix}${this.blankNodeCounter++}`)}literal(e,t){return new u.Literal(e,t)}variable(e){return new o.Variable(e)}defaultGraph(){return s.DefaultGraph.INSTANCE}quad(e,t,a,r){return new l.Quad(e,t,a,r||this.defaultGraph())}fromTerm(e){switch(e.termType){case"NamedNode":return this.namedNode(e.value);case"BlankNode":return this.blankNode(e.value);case"Literal":return e.language?this.literal(e.value,e.language):e.datatype.equals(u.Literal.XSD_STRING)?this.literal(e.value):this.literal(e.value,this.fromTerm(e.datatype));case"Variable":return this.variable(e.value);case"DefaultGraph":return this.defaultGraph();case"Quad":return this.quad(this.fromTerm(e.subject),this.fromTerm(e.predicate),this.fromTerm(e.object),this.fromTerm(e.graph))}}fromQuad(e){return this.fromTerm(e)}resetBlankNodeCounter(){this.blankNodeCounter=0}}},16381:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DefaultGraph=void 0;class a{constructor(){this.termType="DefaultGraph",this.value=""}equals(e){return!!e&&"DefaultGraph"===e.termType}}t.DefaultGraph=a,a.INSTANCE=new a},72808:(e,t,a)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Literal=void 0;const r=a(92016);class s{constructor(e,t){this.termType="Literal",this.value=e,"string"==typeof t?(this.language=t,this.datatype=s.RDF_LANGUAGE_STRING):t?(this.language="",this.datatype=t):(this.language="",this.datatype=s.XSD_STRING)}equals(e){return!!e&&"Literal"===e.termType&&e.value===this.value&&e.language===this.language&&e.datatype.equals(this.datatype)}}t.Literal=s,s.RDF_LANGUAGE_STRING=new r.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"),s.XSD_STRING=new r.NamedNode("http://www.w3.org/2001/XMLSchema#string")},92016:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.NamedNode=void 0,t.NamedNode=class{constructor(e){this.termType="NamedNode",this.value=e}equals(e){return!!e&&"NamedNode"===e.termType&&e.value===this.value}}},63387:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Quad=void 0,t.Quad=class{constructor(e,t,a,r){this.termType="Quad",this.value="",this.subject=e,this.predicate=t,this.object=a,this.graph=r}equals(e){return!!e&&("Quad"===e.termType||!e.termType)&&this.subject.equals(e.subject)&&this.predicate.equals(e.predicate)&&this.object.equals(e.object)&&this.graph.equals(e.graph)}}},71573:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Variable=void 0,t.Variable=class{constructor(e){this.termType="Variable",this.value=e}equals(e){return!!e&&"Variable"===e.termType&&e.value===this.value}}}}]);