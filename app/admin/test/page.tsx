import { getDataSource } from "@/lib/db";
import { Team } from "@/database/entities/Team";

export default async function TestPage() {
  try {
    const dataSource = await getDataSource();
    const teamRepository = dataSource.getRepository(Team);

    const teams = await teamRepository.find();

    const count = await teamRepository.count();

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">✅ Database Test</h1>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2">
            <strong>Connection:</strong> Success
          </p>
          <p className="mb-2">
            <strong>Teams count:</strong> {count}
          </p>
          <pre className="bg-white p-4 rounded mt-4">
            {JSON.stringify(teams, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          ❌ Database Error
        </h1>
        <pre className="bg-red-100 p-4 rounded">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
