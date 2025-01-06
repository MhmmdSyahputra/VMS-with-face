import { ReactNode, useState } from 'react'
import { TbHome2, TbLogout, TbSwitchHorizontal, TbUserPlus, TbUserSearch, TbUsersGroup } from 'react-icons/tb'
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core'
import classes from './sidebar.module.css'
import { useNavigate } from 'react-router-dom'
import Logo from '@assets/icon.png'

interface NavbarLinkProps {
  icon: typeof TbHome2
  label: string
  active?: boolean
  to?: string
  onClick?: () => void
}

function NavbarLink({ icon: Icon, label, active, to, onClick }: NavbarLinkProps): JSX.Element {
  const navigate = useNavigate()
  const handleClick = (): void => {
    if (onClick) {
      onClick()
    }
    if (to) {
      navigate(to)
    }
  }
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={handleClick}
        className={`${classes.link}`}
        data-active={active || undefined}
      >
        <Icon size={20} strokeWidth={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const mockdata = [
  { icon: TbHome2, label: 'Home', to: '/' },
  { icon: TbUserPlus, label: 'Add Visitor', to: '/visitor/add' },
  { icon: TbUsersGroup, label: 'Visitor', to: '/visitor' },
  { icon: TbUserSearch, label: 'Pegawai', to: '/employee' }
]

interface SidebarProps {
  children?: ReactNode
}

// eslint-disable-next-line react/prop-types
export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const navigate = useNavigate()
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

  const logoutSession = (): void => {
    navigate('/login')
  }

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
            <NavbarLink icon={TbLogout} onClick={() => logoutSession()} label="Logout" />
          </Stack>
        </nav>
      </div>
      <div className={`${classes.content} col`}>
        <div className="container-fluid px-4">{children}</div>
      </div>
    </div>
  )
}
