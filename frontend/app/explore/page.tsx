import ProjectCard from "@/components/project-card";

export default function Explore() {
	return (
		<div>
			<ProjectCard
				name="Project 1"
				avatar="/placeholder.svg"
				banner="/placeholder.svg"
				targetAmount={1000}
				raisedAmount={500}
				endDate={new Date()}
				category="Category 1"
				awards={["Award 1", "Award 2", "Award 3"]}
			/>
		</div>
	);
}
