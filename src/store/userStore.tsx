import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
    username: string
    userId: string
    userType: number
    companyId?: string
}

export const useUser = create(
    persist(
        set => ({
            user: null,
            addUser: (currUser: User) =>
                set(() => ({
                    user: currUser,
                })),
            removeUser: () =>
                set(() => ({
                    user: null,
                })),
        }),
        {
            name: "userStorage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
export default useUser
