import { ReactNode, useState } from 'react'
import {
  TbCalendarStats,
  TbDeviceDesktopAnalytics,
  TbFingerprint,
  TbHome2,
  TbLogout,
  TbSettings,
  TbSwitchHorizontal,
  TbUserPlus,
  TbUsersGroup
} from 'react-icons/tb'
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core'
import classes from './sidebar.module.css'
import { Link } from 'react-router-dom'
import Logo from './../../../../../resources/icon.png'

interface NavbarLinkProps {
  icon: typeof TbHome2
  label: string
  active?: boolean
  to?: string
  onClick?: () => void
}

function NavbarLink({ icon: Icon, label, active, to, onClick }: NavbarLinkProps): JSX.Element {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link to={to!} className={classes.link}>
        <UnstyledButton
          onClick={onClick}
          className={`${classes.link}`}
          data-active={active || undefined}
        >
          <Icon size={20} strokeWidth={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  )
}

const mockdata = [
  { icon: TbHome2, label: 'Home', to: '/' },
  { icon: TbUserPlus, label: 'Add Visitor', to: '/visitor/add' },
  { icon: TbUsersGroup, label: 'Employee', to: '/employee' },
  { icon: TbDeviceDesktopAnalytics, label: 'Analytics', to: '/' },
  { icon: TbCalendarStats, label: 'Releases', to: '/' },
  { icon: TbFingerprint, label: 'Security', to: '/' },
  { icon: TbSettings, label: 'Settings', to: '/' }
]

interface SidebarProps {
  children?: ReactNode
}

// eslint-disable-next-line react/prop-types
export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [active, setActive] = useState(0)

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      to={link.to}
      onClick={() => setActive(index)}
    />
  ))

  return (
    <div className="row g-1">
      <div className="col-auto">
        <nav className={classes.navbar} style={{ height: '95vh' }}>
          <Center>
            <img src={Logo} alt="" width={40} />
          </Center>

          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {links}
            </Stack>
          </div>

          <Stack justify="center" gap={0}>
            <NavbarLink icon={TbSwitchHorizontal} label="Change account" />
            <NavbarLink icon={TbLogout} label="Logout" />
          </Stack>
        </nav>
      </div>
      <div className={`${classes.content} col`}>
        <div className="container-fluid px-4">{children}</div>
      </div>
    </div>
  )
}
