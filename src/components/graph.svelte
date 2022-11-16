<script>
	import Chart from 'chart.js/auto/auto.js';
	import {onMount} from 'svelte';

	export let data;

	let selected = data.region;

	const strompris = data.graph_data.map((obj) => obj.ore_per_kWh);
	const labels = data.graph_data.map((obj) => obj.start);

	const tid_naa = new Date();
	const current = strompris[labels.findIndex((el) => el == tid_naa.getHours())];

	let portfolio;
	const config = {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: 'Strømpris',
					data: strompris,
					fill: true,
					borderColor: 'rgb(250, 194, 19)',
					backgroundColor: 'rgba(240, 165, 0, 0.5)',
					tension: 0.2,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					displayColors: false,
					position: 'nearest',
					callbacks: {
						title: (Tooltipitem) =>
							`${String(Tooltipitem[0].dataIndex).padStart(2, '0')}:00-${String(
								Tooltipitem[0].dataIndex + 1
							).padStart(2, '0')}:00`,
						label: (TooltipItem) =>
							`${TooltipItem.dataset.label}: ${TooltipItem.raw.toFixed(1)} øre`,
					},
				},
			},
			interaction: {
				mode: 'index',
				intersect: false,
			},
			scales: {
				y: {
					suggestedMax: Math.max.apply(null, strompris) + 1,
					beginAtZero: true,
				},
			},
		},
	};

	onMount(() => {
		const ctx = portfolio.getContext('2d');
		// Initialize chart using default config set
		const myChart = new Chart(ctx, config);
	});
</script>

<div class="container">
	<form action={`/${selected}`}>
		<select
			name="region"
			value={data.region}
			on:change={(e) => (selected = e.target.value)}
		>
			<option value="NO1">NO1 / Oslo / Øst-Norge</option>
			<option value="NO2">NO2 / Kristiansand / Sør-Norge</option>
			<option value="NO3">NO3 / Trondheim / Midt-Norge</option>
			<option value="NO4">NO4 / Tromsø / Nord-Norge</option>
			<option value="NO5">NO5 / Bergen / Vest-Norge</option>
		</select>
		<button>Sjekk!</button>
	</form>

	<h2>Akkurat nå: {current.toFixed(1)} øre</h2>

	<div class="graph">
		<canvas bind:this={portfolio} />
	</div>

	<div class="info">
		<p class="flex-item flex-line">Dato: {data.day}</p>
		<p class="flex-item flex-line">
			Strømpriser levert av
			<a href="https://www.hvakosterstrommen.no"> Hva koster strømmen.no</a>
		</p>
		<p class="flex-item">
			<a href="\om">FAQ</a>
		</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.graph {
		height: 400px;
		width: 550px;
	}

	.info {
		font-size: 0.7rem;
		position: fixed;
		width: 100%;
		bottom: 0px;
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.flex-line::after {
		content: '';
		padding-left: 1rem;
		border-right: 2px solid black;
		align-self: stretch;
	}
</style>
