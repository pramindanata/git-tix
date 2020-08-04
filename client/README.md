This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Note

### App always fetch current user on each navigation

This problem occurs because current user fetcher run inside custom app `getInitialProps` method and `getInitialProps` method always re-run on each navigation/load. This problem is big *no no* in my opiniom because there will be a lot of request coming into `auth service`.

To prevent this problem, i need to make sure current user fetcher only runs **once** and no request sended again after the client app has user data. These are the conditions where current user fetcher will be called:

1. When opening a new page (by typing URL, reloading, or opening a new tab), **OR**
2. When navigation page in a same tab **IF** user is signed in. Data fetched only once, no fetch needed after the next navigation.

So, how do i solve it ? First, i create a `user store` variable in custom `_app` component. This store will contain fetched user data before passed to component childrens on each page navigation/load. If this store is filled with user data, it will prevent `_app` component to re-fetch current user data. This variable only exists inside `_app` component, and its value will be passed to component props or state management store (Redux, etc). And i need some mechanism to tell the client app if user is signed in. JS can't get browser cookie because it set with `HTTPOnly` label, so i need an alternative, so i choose `Local Storage`. I will put some key-value to LS if user is signed in and remove it if user is signed out (ex: `key: sign, value: 'true'`).

*Wait, why not use LS to stored user data instead of storing it in computer/browser memory ?*

Hmmm, i think it dangerous because user data will be exposed easily on XSS attack. I will choose LS if the data does not contain any sensitive data.

Here is more details about my soluton:

1. When user open new page and sign in, `SignIn` or `SignUp` component will set auth status on LS (i will call it `isSignin`).
2. After user redirected to homepage, `_app` component will trigger `getInitialProps` method (in client side).
3. Inside `getInitialProps`, if `isSignin` is `true` i send request to get current-user data.
4. Data fetched -> `getInitialProps` return value -> i set `userStore` with fetched user data.
5. `userStore` data passed to component props.
6. On each navigation (still in client side), if `isSignin === true` and `userStore` filled with value, `_app` `getInitialProps` will not re-fetch user data.
7. If user is signed out (`isSignin` is removed from LS), on each navigation `getInitialProps` will try to clear `userStore` value, so no user value passed to other component.
