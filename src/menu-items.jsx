import { faHeading, faHome } from "@fortawesome/free-solid-svg-icons";

const menuItems = {
  items: [
    {
      id: 'overview',
      title: 'Overview',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: faHome,
          url: '/dashboard'
        }
      ]
    },
    {
      id: 'templates',
      title: 'Templates',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'header',
          title: 'Header',
          type: 'item',
          icon: faHeading,
          url: '/header-section'
        }
      ]
    },
  ]
};

export default menuItems;
