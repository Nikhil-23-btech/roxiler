import RegisterForm from '../RegisterForm'

export default function RegisterFormExample() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegisterForm
        onRegister={(data) => console.log('Register:', data)}
        onSwitchToLogin={() => console.log('Switch to login')}
      />
    </div>
  )
}
