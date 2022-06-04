import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Center, Group, Image, Loader, Select, Textarea, TextInput, Title } from "@mantine/core";
import "dayjs/locale/fr";
import { useForm } from "@mantine/form";
import { DeviceFloppy, Photo, X } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { getImagesList, getObjectImage } from "../../api/ImagesConsumer";
import { useAuthContext } from "../../components/AuthProvider";
import { showNotification } from "@mantine/notifications";
import { Tenant } from "../../api/models/tenant";
import useTenant from "../../hooks/useTenant";
import { updateTenant } from "../../api/TenantConsumer";
import { DatePicker } from "@mantine/dates";

// TODO: fix the entry and leave date picker

const PreviewImage = ({ token, tenant, imgName }: { token: string; tenant: Tenant; imgName: string }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		(async () => {
			const imgBlob = await getObjectImage(token, "tenant", tenant.id, imgName);
			setUrl(URL.createObjectURL(imgBlob));
		})();
	}, [imgName]);

	return (
		<Center mt="md" style={{ marginLeft: "auto", marginRight: "auto" }}>
			<Image src={url} height={300} width="auto" />
		</Center>
	);
};

const EditTenantPage = () => {
	let { id } = useParams();
	const { accessToken } = useAuthContext();
	const [tenant] = useTenant(id);
	const [imagesList, setImagesList] = useState([] as string[]);
	const [fetchedImageList, setFetchedImageList] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			image: "",
			fullname: "",
			former_address: "",
			next_address: "",
			comments: "",
			entry_date: "",
			leave_date: "",
			email: "",
			tel: ""
		},

		validate: {}
	});

	useEffect(() => {
		if (!tenant) return;

		// fetch images
		(async () => {
			const names = await getImagesList(accessToken, "tenant", tenant.id);
			setImagesList(names);
			setFetchedImageList(true);
		})();
	}, [tenant]);

	useEffect(() => {
		if (!tenant) return;
		if (!fetchedImageList) return;

		const imageUrl = imagesList.length > 0 ? tenant.image : "";

		form.setValues({
			image: imageUrl,
			fullname: tenant.fullname,
			former_address: tenant.former_address,
			next_address: tenant.next_address,
			comments: tenant.comments,
			entry_date: formatDate(new Date(tenant.entry_date)),
			leave_date: formatDate(new Date(tenant.leave_date)),
			email: tenant.email,
			tel: tenant.tel
		});
	}, [tenant, imagesList, fetchedImageList]);

	// show loader if data is not ready
	if (tenant == undefined || fetchedImageList == false) {
		return (
			<Center style={{ height: "50vh" }}>
				<Loader variant="bars" color="teal" />
			</Center>
		);
	}

	const sendUpdateTenant = async (values: any) => {
		form.clearErrors();
		setLoading(true);

		let tenantToSend: Tenant = {
			...tenant,
			image: values["image"],
			fullname: values["fullname"],
			former_address: values["former_address"],
			next_address: values["next_address"],
			comments: values["comments"],
			entry_date: values["entry_date"],
			leave_date: values["leave_date"],
			email: values["email"],
			tel: values["tel"]
		};
		const response = await updateTenant(accessToken, tenantToSend);

		// success
		if (response.status == 200) {
			showNotification({
				color: "teal",
				autoClose: 5000,
				title: "Opération réussie !",
				message: "Les informations du locataire ont été modifiées. Retour à la page précédente."
			});
			form.reset();
			navigate(-1);
		}
		// other error
		else {
			showNotification({
				color: "red",
				autoClose: 15000,
				title: "Erreur serveur!",
				message: "Quelque chose s'est mal déroulé. Veuillez rééssayer ultérieurement"
			});
		}

		setLoading(false);
	};

	const dateParser = (input: string) => {
		const parts = input.split("/");
		return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
	};

	function padTo2Digits(num: number) {
		return num.toString().padStart(2, "0");
	}

	function formatDate(date: Date): string {
		return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join("/");
	}

	return (
		<div>
			<Title order={1}>Editer un locataire</Title>

			<Card mt="sm" radius="md">
				<form onSubmit={form.onSubmit((values) => sendUpdateTenant(values))}>
					<TextInput
						data-autofocus
						disabled={loading}
						required
						label="Nom complet"
						description="Nom de famille et prénoms"
						{...form.getInputProps("fullname")}
					/>

					<Group spacing="md" mt="md" position="apart">
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							required
							label="Adresse email"
							placeholder="j.dupont@gmail.com"
							{...form.getInputProps("email")}
						/>
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							label="Numéro de téléphone"
							placeholder="+33 6 04 45 69 58"
							{...form.getInputProps("tel")}
						/>
					</Group>

					<Group spacing="md" mt="md" position="apart">
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							label="Adresse précédente"
							placeholder="1 rue du ciel 67000 Strasbourg"
							{...form.getInputProps("former_address")}
						/>
						<TextInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							label="Prochaine adresse"
							placeholder="1 rue Goéland 67000 Strasbourg"
							{...form.getInputProps("next_address")}
						/>
					</Group>

					<Textarea
						mt="md"
						disabled={loading}
						placeholder="Locataire payant uniquement en chèques ..."
						label="Commentaires"
						autosize
						minRows={4}
						{...form.getInputProps("comments")}
					/>

					<Group spacing="md" mt="md" position="apart">
						<DatePicker
							locale="fr"
							allowFreeInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							inputFormat="DD/MM/YYYY"
							dateParser={dateParser}
							label="Date d'entrée"
							{...form.getInputProps("entry_date")}
						/>
						<DatePicker
							locale="fr"
							allowFreeInput
							disabled={loading}
							style={{ maxWidth: "calc(50% - 10px)", width: "100%" }}
							dateParser={dateParser}
							inputFormat="DD/MM/YYYY"
							label="Date de sortie"
							{...form.getInputProps("leave_date")}
						/>
					</Group>

					<Select
						disabled={loading}
						label="Image de couverture"
						description="Image s'affichant dans les différents menus"
						placeholder="Veuillez choisir"
						icon={<Photo size={18} />}
						{...form.getInputProps("image")}
						mt="md"
						data={imagesList.map((img) => ({ value: img, label: img }))}
						onChange={(value) => form.setFieldValue("image", value!)}
					/>

					{form.values["image"] != "" && (
						<PreviewImage token={accessToken} tenant={tenant} imgName={form.values["image"]} />
					)}

					<Group position="center" mt="lg">
						<Button leftIcon={<DeviceFloppy />} color="teal" type="submit" loading={loading}>
							Enregistrer
						</Button>
						<Button leftIcon={<X />} color="gray" onClick={() => navigate(-1)} disabled={loading}>
							Annuler
						</Button>
					</Group>
				</form>
			</Card>
		</div>
	);
};

export default EditTenantPage;
