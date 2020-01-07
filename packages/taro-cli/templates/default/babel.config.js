module.exports = {
  presets: [
    ['@babel/env']<% if (framework === "react" || framework === "nerv") {%>,
    [
      '@babel/preset-react',
      {
        'pragma': '<%= framework === "react" ? "React" : "Nerv"  %>.createElement', // default pragma is React.createElement
        'pragmaFrag': '<%= framework === "react" ? "React" : "Nerv"  %>.Fragment', // default is React.Fragment
      }
    ],<%}%>
    // '@babel/typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      "useESModules": true,
    }],
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true
      }
    ]
  ]
}
