import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { t as Route } from "./_token-CN41-8Aj.mjs";
import { t as supabase } from "./_ssr/supabase-B0HIM6lB.mjs";
import { I as ChevronDown, L as Check, b as LoaderCircle, j as ClipboardList, s as Send } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_token-DuH3zxpu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var healthConditionOptions = [
	"Diabetes",
	"Hipertensão",
	"Problemas circulatórios",
	"Problemas renais",
	"Gestante"
];
var footConditionOptions = [
	"Unha encravada",
	"Micose",
	"Calosidade",
	"Rachaduras",
	"Verruga plantar"
];
var symptomDurationOptions = [
	"Menos de 1 semana",
	"1 a 4 semanas",
	"Mais de 1 mês"
];
var previousTreatmentOptions = [
	"Não",
	"Sim, recentemente",
	"Sim, há mais de 1 ano"
];
var skinTypeOptions = [
	"Normal",
	"Seca",
	"Oleosa",
	"Muito ressecada"
];
function PreencherAnamnese() {
	const { token } = Route.useParams();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [anamnese, setAnamnese] = (0, import_react.useState)(null);
	const [client, setClient] = (0, import_react.useState)(null);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [profession, setProfession] = (0, import_react.useState)("");
	const [mainComplaint, setMainComplaint] = (0, import_react.useState)("");
	const [symptomDuration, setSymptomDuration] = (0, import_react.useState)("");
	const [previousPodologicalTreatment, setPreviousPodologicalTreatment] = (0, import_react.useState)("");
	const [previousSurgeries, setPreviousSurgeries] = (0, import_react.useState)("");
	const [healthConditions, setHealthConditions] = (0, import_react.useState)([]);
	const [hasAllergies, setHasAllergies] = (0, import_react.useState)(false);
	const [allergies, setAllergies] = (0, import_react.useState)("");
	const [medications, setMedications] = (0, import_react.useState)("");
	const [footConditions, setFootConditions] = (0, import_react.useState)([]);
	const [skinType, setSkinType] = (0, import_react.useState)("");
	const [observations, setObservations] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		loadAnamnese();
	}, [token]);
	async function loadAnamnese() {
		setLoading(true);
		setError("");
		const { data, error: anamneseError } = await supabase.from("anamneses").select("id, client_id, public_token, status").eq("public_token", token).maybeSingle();
		if (anamneseError) {
			console.error("ERRO SUPABASE ANAMNESE:", anamneseError);
			setError(`Erro: ${anamneseError.message}`);
			setLoading(false);
			return;
		}
		if (!data) {
			setError("Esta ficha não existe ou o link é inválido.");
			setLoading(false);
			return;
		}
		if (data.status === "preenchida") {
			setAnamnese(data);
			setSubmitted(true);
			setLoading(false);
			return;
		}
		const { data: clientData, error: clientError } = await supabase.from("clients").select("id, name, phone").eq("id", data.client_id).maybeSingle();
		if (clientError) {
			console.error("Erro ao carregar paciente:", clientError);
			setError("Não foi possível carregar os dados do paciente.");
			setLoading(false);
			return;
		}
		if (!clientData) {
			setError("Paciente relacionado à ficha não foi encontrado.");
			setLoading(false);
			return;
		}
		setAnamnese(data);
		setClient(clientData);
		setLoading(false);
	}
	function toggleArrayValue(value, current, setter) {
		setter((values) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		if (!anamnese) {
			setError("Ficha não encontrada.");
			return;
		}
		if (anamnese.status === "preenchida") {
			setSubmitted(true);
			return;
		}
		if (!birthDate) {
			setError("Informe sua data de nascimento.");
			return;
		}
		if (!mainComplaint.trim()) {
			setError("Informe o motivo da consulta.");
			return;
		}
		setSubmitting(true);
		const { data, error: updateError } = await supabase.from("anamneses").update({
			birth_date: birthDate || null,
			profession: profession.trim() || null,
			main_complaint: mainComplaint.trim() || null,
			symptom_duration: symptomDuration || null,
			previous_podological_treatment: previousPodologicalTreatment || null,
			previous_surgeries: previousSurgeries.trim() || null,
			health_conditions: healthConditions.length > 0 ? healthConditions : null,
			has_allergies: hasAllergies,
			allergies: hasAllergies ? allergies.trim() || null : null,
			medications: medications.trim() || null,
			foot_conditions: footConditions.length > 0 ? footConditions : null,
			skin_type: skinType || null,
			observations: observations.trim() || null,
			status: "preenchida",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("public_token", token).eq("status", "pendente").select("id, client_id, public_token, status").maybeSingle();
		if (updateError) {
			console.error("Erro ao salvar ficha:", updateError);
			setSubmitting(false);
			setError("Não foi possível enviar a ficha. Tente novamente.");
			return;
		}
		if (!data) {
			setSubmitting(false);
			setSubmitted(true);
			return;
		}
		setAnamnese(data);
		setSubmitted(true);
		setSubmitting(false);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-7 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando sua ficha..."
			})]
		})
	}) });
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[65vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface w-full max-w-md p-6 text-center sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-2xl font-bold",
					children: "Ficha enviada!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm leading-6 text-muted-foreground",
					children: [
						"Obrigado,",
						" ",
						client?.name ? client.name.split(" ")[0] : "por preencher a ficha",
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: "Suas informações foram enviadas com sucesso para a profissional responsável pelo seu atendimento."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-2xl bg-secondary px-4 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Você já pode fechar esta página."
					})
				})
			]
		})
	}) });
	if (error && !anamnese) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[65vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card-surface w-full max-w-md p-6 text-center sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-xl font-bold",
					children: "Não foi possível abrir a ficha"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-muted-foreground",
					children: error
				})
			]
		})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-bold tracking-tight",
					children: "Ficha de Anamnese"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: "Preencha as informações abaixo antes do seu atendimento."
				}),
				client && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-2xl bg-primary-soft px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Paciente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-bold text-primary",
						children: client.name
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Dados pessoais",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Data de nascimento *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: birthDate,
							onChange: (event) => setBirthDate(event.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Profissão",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Ex.: Professora",
							value: profession,
							onChange: (event) => setProfession(event.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Queixa principal",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Motivo da consulta *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Descreva o motivo da consulta...",
							value: mainComplaint,
							onChange: (event) => setMainComplaint(event.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tempo dos sintomas",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: symptomDuration,
							onChange: (event) => setSymptomDuration(event.target.value),
							options: symptomDurationOptions,
							placeholder: "Selecione uma opção"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Histórico",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Já realizou tratamento podológico?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: previousPodologicalTreatment,
							onChange: (event) => setPreviousPodologicalTreatment(event.target.value),
							options: previousTreatmentOptions,
							placeholder: "Selecione uma opção"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cirurgias anteriores",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Descreva, caso tenha realizado...",
							value: previousSurgeries,
							onChange: (event) => setPreviousSurgeries(event.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Condições de saúde",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Marque as condições que se aplicam a você."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckGroup, {
						items: healthConditionOptions,
						selected: healthConditions,
						onToggle: (value) => toggleArrayValue(value, healthConditions, setHealthConditions)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Alergias",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Possui alergias?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setHasAllergies(false);
									setAllergies("");
								},
								className: `min-h-12 rounded-xl border text-sm font-semibold transition-colors ${!hasAllergies ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`,
								children: "Não"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setHasAllergies(true),
								className: `min-h-12 rounded-xl border text-sm font-semibold transition-colors ${hasAllergies ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`,
								children: "Sim"
							})]
						})
					}), hasAllergies && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quais alergias?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Ex.: esparadrapo, iodo...",
							value: allergies,
							onChange: (event) => setAllergies(event.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Medicamentos",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Uso contínuo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Liste os medicamentos em uso...",
							value: medications,
							onChange: (event) => setMedications(event.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Avaliação dos pés",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Marque os itens que se aplicam."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckGroup, {
							items: footConditionOptions,
							selected: footConditions,
							onToggle: (value) => toggleArrayValue(value, footConditions, setFootConditions)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tipo de pele",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: skinType,
								onChange: (event) => setSkinType(event.target.value),
								options: skinTypeOptions,
								placeholder: "Selecione uma opção"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Observações",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Informações adicionais",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Alguma informação que considera importante...",
							value: observations,
							onChange: (event) => setObservations(event.target.value)
						})
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium leading-5 text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-secondary/50 px-4 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-5 text-muted-foreground",
						children: "Ao enviar esta ficha, suas informações serão encaminhadas para a profissional responsável pelo seu atendimento."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: submitting,
					className: "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
					children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), "Enviando ficha..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-5" }), "Enviar ficha"] })
				})
			]
		})]
	}) });
}
function PublicLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-8 flex max-w-2xl items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-bold tracking-tight",
						children: "Podocare"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "Ficha de atendimento"
					})]
				})
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto mt-10 max-w-2xl pb-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Formulário seguro do Podocare"
				})
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface space-y-4 p-5 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-bold uppercase tracking-wider text-primary",
			children: title
		}), children]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
var inputClass = "w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";
function Input({ type = "text", placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		placeholder,
		value,
		onChange,
		className: `${inputClass} h-13 py-3.5`
	});
}
function Textarea({ placeholder, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		rows: 4,
		placeholder,
		value,
		onChange,
		className: `${inputClass} resize-none py-3.5`
	});
}
function Select({ options, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value,
			onChange,
			className: `${inputClass} h-13 appearance-none py-3.5 pr-10`,
			children: [placeholder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: placeholder
			}), options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: option,
				children: option
			}, option))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" })]
	});
}
function CheckGroup({ items, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: items.map((item) => {
			const checked = selected.includes(item);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: `flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors ${checked ? "bg-primary-soft" : "hover:bg-secondary"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked,
					onChange: () => onToggle(item),
					className: "size-5 shrink-0 rounded-md border-border accent-[oklch(0.62_0.09_205)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 text-sm",
					children: item
				})]
			}, item);
		})
	});
}
//#endregion
export { PreencherAnamnese as component };
