import { scoped, Lifecycle } from "tsyringe";

export interface AuthUserProps {
  id: number;
  email: string;
  role?: string;
}

@scoped(Lifecycle.ContainerScoped)
export class AuthUserEntity {
  id: number;
  email: string;
  role?: string;
  
  constructor(props?: AuthUserProps) {
    this.id = props?.id || 0;
    this.email = props?.email || '';
    this.role = props?.role;
  }
  
  isAuthenticated(): boolean {
    return this.id > 0;
  }
  
  hasRole(role: string): boolean {
    return this.role === role;
  }
}