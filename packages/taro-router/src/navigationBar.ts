const home_svg_str =`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.8899 12.2737C23.8232 12.3584 23.7237 12.3997 23.6198 12.3974H20.7994V23.5996C20.7994 23.8194 20.6213 24 20.4001 24H14.7994C14.5791 24 14.4002 23.8194 14.4002 23.5996V15.6H9.59963V23.5996C9.59963 23.8194 9.42075 24 9.20033 24H3.59968C3.48981 24 3.38964 23.954 3.31764 23.8811C3.24495 23.8091 3.2004 23.7087 3.2004 23.5996V12.3975H0.398546V12.3967C0.296893 12.396 0.194446 12.3544 0.11579 12.2738C-0.0371146 12.114 -0.0400714 11.864 0.11579 11.7076L11.7201 0.117284C11.8767 -0.0390948 12.1298 -0.0390948 12.2863 0.117284L23.8899 11.7076C24.0465 11.864 24.0265 12.0995 23.8899 12.2737ZM12.0029 0.964625L1.37086 11.5854L3.59968 11.5839V11.5999C3.65537 11.5999 3.70804 11.611 3.75557 11.6307C3.89952 11.692 4.00046 11.8339 4.00046 11.9996V23.1991H8.79955V15.2003C8.79955 14.9789 8.97917 14.8002 9.20033 14.8002H14.7995C15.0207 14.8002 15.2003 14.9789 15.2003 15.2003V23.1991H20.0001V11.9996C20.0001 11.8339 20.1003 11.692 20.2443 11.6307C20.2918 11.611 20.3453 11.5999 20.4001 11.5999V11.5713L22.6193 11.5691L12.0029 0.964625Z" fill="currentColor"/>
</svg>
`

const back_svg_str = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8206 22.9016L7.45515 11.8756L17.8206 1.09845C18.0598 0.849741 18.0598 0.435233 17.8206 0.186528C17.5814 -0.0621762 17.1827 -0.0621762 16.9435 0.186528L6.1794 11.4611C5.9402 11.7098 5.9402 12.1244 6.1794 12.3731L16.9435 23.8135C17.1827 24.0622 17.5814 24.0622 17.8206 23.8135C18.0598 23.5648 18.0598 23.1503 17.8206 22.9016Z" fill="currentColor"/>
</svg>

`

export function initNavigationBar (container: HTMLElement) {
  const navigationBar = document.createElement('taro-navigation-bar-wrap')
  navigationBar.classList.add('taro-navigation-bar-no-icon')
  const navigationBarBackBtn = document.createElement('taro-navigation-bar-back')
  const navigationBarHomeBtn = document.createElement('taro-navigation-bar-home')
  navigationBarBackBtn.innerHTML = back_svg_str
  navigationBarHomeBtn.innerHTML = home_svg_str
  const navigationBarTitle = document.createElement('taro-navigation-bar-title')
  navigationBar.appendChild(navigationBarHomeBtn)
  navigationBar.appendChild(navigationBarBackBtn)
  navigationBar.appendChild(navigationBarTitle)
  navigationBar.id = 'taro-navigation-bar'
  container.prepend(navigationBar)
}

