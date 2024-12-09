import { faBoxArchive, faHeading, faHome, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

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
        },
        {
          id: 'about-us',
          title: 'About-Us',
          type: 'item',
          icon: faPeopleGroup,
          url: '/about-us'
        }
      ]
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'archive',
          title: 'Archive',
          type: 'item',
          icon: faBoxArchive,
          url: '/archive'
        }
      ]
    },
  ]
};

export default menuItems;
