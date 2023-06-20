<% if (typescript) {%>import { UserConfigExport } from "@tarojs/cli";
<%}%>
export default {
  mini: {},
  h5: {}
}<% if (typescript) {%> satisfies UserConfigExport<%}%>
