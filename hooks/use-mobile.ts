import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // ใช้ undefined เพื่อเลี่ยงปัญหา Hydration mismatch ใน Next.js
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // ใช้ MatchMedia เช็คที่ 768px (เท่ากับ md: ของ Tailwind)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      // ใช้ mql.matches แทน window.innerWidth เพื่อความแม่นยำตาม CSS
      setIsMobile(mql.matches)
    }

    mql.addEventListener('change', onChange)
    
    // Set ค่าครั้งแรกเมื่อ Component mount
    setIsMobile(mql.matches)

    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}