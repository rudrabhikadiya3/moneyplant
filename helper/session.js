import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

const sessionOptions = {
    password: 'ZeHWNa7GD0ug1062cCFfuXPkbvRCKGnk',
    cookieName: 'ladderUser',
    cookieOptions: {
        maxAge: undefined,
        secure: process.env.NODE_ENV === 'production',
    },
}

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions)
}
