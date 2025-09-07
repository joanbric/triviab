console.log(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
const res = await fetch(`http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/triviab`)
const data = await res.json()

console.log(data)

import Link from 'next/link'
export default function TriviabPage() {
  return (
    <>
      <h1>Triviab page</h1>

      <Link href="/triviab/edit" className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer">
        Create a new triviab
      </Link>

      <main className="max-w-5xl mx-auto overflow-hidden">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-5">
          {data &&
            data.map((triviab: { id: string; title: string }) => (
              <li key={triviab.id}>
                <Link href={`/triviab/edit/${triviab.id}`} className="block bg-secondary/20 rounded-2xl p-5">
                  {triviab.title}
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  )
}
