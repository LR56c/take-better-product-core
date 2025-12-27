export enum RoleLevel {
  ADMIN  = 3,
  MOD    = 2,
  USER   = 1,
  PUBLIC = 0,
}

export const roleMap        = new Map<string, string>( [
  ["admin", "Administrador"],
  ["mod", "Moderador"],
  ["user", "Usuario"]
] )

export const matchRole = ( role ?: string ): RoleLevel | undefined => {
  if ( !role ) {
    return undefined
  }
  const roleMap: { [key: string]: RoleLevel } = {
    admin : RoleLevel.ADMIN,
    mod   : RoleLevel.MOD,
    user  : RoleLevel.USER,
    public: RoleLevel.PUBLIC
  }
  return roleMap[role] !== undefined ? roleMap[role] : undefined
}
