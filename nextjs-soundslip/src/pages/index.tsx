

export default function Home(props: []) {
  return (
    <div data-testid="create-next-app">Welcome to Next.js!

    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  }
}
