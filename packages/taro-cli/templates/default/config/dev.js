<% if (typescript) {%>import type { UserConfigExport } from "@tarojs/cli";
<%}%>
export default {
  <% if (compiler === 'webpack5') {%>logger: {
    quiet: false,
    stats: true
  },<%}%>
  mini: {},
  h5: {}
}<% if (typescript) {%> satisfies UserConfigExport<%}%>
