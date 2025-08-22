import { useContext } from "react"
import { useSelector } from "react-redux"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { AuthContext } from "../../App"

const Header = () => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <header className="h-16 bg-surface border-b border-gray-600 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
          <ApperIcon name="Code2" size={18} className="text-background" />
        </div>
        <h1 className="text-xl font-mono font-bold text-white">DevTask Manager</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { 
            weekday: "short", 
            month: "short", 
            day: "numeric" 
          })}
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-300">
              {user.firstName} {user.lastName}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="LogOut" size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        )}
        
        <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
      </div>
    </header>
  )
}

export default Header